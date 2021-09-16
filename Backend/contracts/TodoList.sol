// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated  (
        uint id,
        string content,
        bool completed
    );


    event TaskCompleted  (
        uint id,
        bool completed
    );

    event TaskDeleted (
        uint id
    );

    function taskCreated(string memory _content , uint _id) public {
        taskCount++;
        tasks[taskCount] = Task(_id , _content , false);
        emit TaskCreated(_id, _content, false);
    }

    function toggleCompleted(uint _id) public {
        uint indexToBeUpdated;
       for(uint i=1 ; i<=taskCount ; i++){
           if(tasks[i].id == _id){
               indexToBeUpdated = i;
               break;
           }
       }
       Task memory _task = tasks[indexToBeUpdated];
       _task.completed = true;
       tasks[indexToBeUpdated] = _task;
       emit TaskCompleted(_id, _task.completed);
    }

    function deleteTask(uint _id) public {
        uint indexToBeDeleted;
        for(uint i=1 ; i<=taskCount ; i++){
            if(tasks[i].id == _id){
                indexToBeDeleted = i;
                break;
            }
        }

// here we are checking if the index to be deleted is not the last element and if its true than we will swap to last element from the index to be deleted and than we will delete the last element
        if(indexToBeDeleted < taskCount){
            tasks[indexToBeDeleted] = tasks[taskCount];
        }

        taskCount--;
        emit TaskDeleted(_id);
        
    }

}