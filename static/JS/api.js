const deleteIconUrl = "{{ url_for('static', filename='images/delete.png') }}"
window.addEventListener("load",()=>{
    checkStatus();
})
function checkStatus(){
    fetch("/checkStatus")
    .then(response => response.json())
    .then(result =>{
       if(result.user){
        document.getElementById("userPage").style.display = "none";
        document.getElementById("userDiv").style.display = "flex";
        document.querySelector("#userDiv h2").textContent = result.user.toUpperCase();
        get_todo();
       }
        username = result.user || "User";
        username = username.toUpperCase();
        sentence = `Hello ${username}`;
        typewriter(); 
    })
    .catch(err => console.log(err))
}

async function get_todo() {
    try {
        const response = await fetch("/todo");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.taskList);

        const tbody = document.querySelector("#todoData table tbody");
        tbody.innerHTML = ""; // Clear existing rows
        result.taskList.forEach((element, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><input type="checkbox" /></td>
                <td>${index + 1}</td>
                <td>${element.todoName}</td>
                <td>${element.created_at}</td>
                <td>${element.due_date}</td>
                <td><button class="delete-btn" data-id="${element.id}"><img src="static/images/delete.png" style="width:20px;"/></button></td>
            `;
            tbody.appendChild(tr);

            const deleteButton = tr.querySelector(".delete-btn");
            deleteButton.addEventListener("click", delete_todo);
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        alert("Failed to load tasks. Please try again later.");
    }
}



const form = document.querySelector("#todo");

form.addEventListener("submit",async (event)=>{
    event.preventDefault();
    const data = {
        "todoName":document.getElementById("todoName").value,
        "due_date":document.getElementById("dueDate").value
    }
    const response = await fetch("/todo",{
        method:"POST",
        headers:{
            'Content-type':"application/json"
        },
        body:JSON.stringify(data)
    });
    const result = await response.json();
    if(response.ok){
        get_todo();
        form.reset();
        form.parentElement.style.display ="none";
    }
});


async function delete_todo(event){
    const taskId = event.target.parentElement.dataset.id;
    try {
        const deleteResponse = await fetch(`/todo`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: taskId }),
        });
        if (!deleteResponse.ok) {
            throw new Error(`Failed to delete task with ID ${taskId}`);
        }
        alert("Task deleted successfully!");
        // Refresh the todo list after successful deletion
        get_todo();
    } catch (deleteError) {
        console.error("Error deleting task:", deleteError);
        alert("Failed to delete the task. Please try again later.");
    }
}