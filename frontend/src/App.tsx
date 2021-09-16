import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Web3 from 'web3';
import TodoList from "./abi/TodoList.json"
import { useDispatch, useSelector } from "react-redux"
import { addTodo, setTodo } from "./store/todoListSlice"
import { RootStateType } from './store/store';


declare let window: any;

function App() {

  const dispatch = useDispatch()

  const style = {
    height: "2rem",
    width: "16rem",
  }

  const address = "0x3850a9B78cCbfab9Da962Cb1Edc17F4c2C00E43a"
  const [todoListContract, setTodoListContract] = useState<any>();
  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false)
  const [balance, setBalance] = useState<string | null>(null)
  const [tasks, setTasks] = useState<any>([])
  const textValue = useRef<HTMLInputElement>(null);
  const checkBox = useRef<HTMLInputElement>(null);


  const todoRedux = useSelector((state: RootStateType) => { return state.todos })


  const getTasks = async (contract: any) => {
    setLoading(true)
    const taskCount = await contract.methods.taskCount().call();
    let userTasks = []
    for (let i = 1; i <= taskCount; i++) {
      const task = await contract.methods.tasks(i).call();
      userTasks.push({ id: task.id, content: task.content, completed: task.completed });
    }
    dispatch(setTodo({ count: taskCount, todos: userTasks }));
    setLoading(false)
  }

  const createTask = async (content: string | undefined) => {
    console.log("content", content)
    const rseed = Math.round(Math.random() * 1000 + 1);
    console.log("rseed", rseed);
    setLoading(true);
    todoListContract.methods
      .taskCreated(content, rseed)
      .send({ from: account })
      .on("receipt", (receipt: any) => {
        console.log("receipt", receipt);
        const task = {
          id: rseed,
          content: content,
          completed: false,
        }
        dispatch(addTodo(task))
        const tmp = [...tasks];
        tmp.push(task)
        setTasks(tmp)
        setLoading(false)
      });
  };

  const loadBloackchain = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();

      const web3 = new Web3(Web3.givenProvider);
      const networkId: number = await web3.eth.net.getId();
      const networkResult = networkId as unknown as keyof typeof TodoList.networks
      const networkData = TodoList.networks[networkResult];
      const todoContract = new web3.eth.Contract(TodoList.abi as any, networkData.address);
      setTodoListContract(todoContract);
      console.log("todoListcontrac", todoListContract)
      const balance = await web3.eth.getBalance(address)
      const balanceinEther = web3.utils.fromWei(balance, "ether");
      setBalance(balanceinEther)
      const account = await web3.eth.getAccounts()
      setAccount(account[0]);
      getTasks(todoContract)
    }
  }

  useEffect(() => {
    setTasks(todoRedux?.todos)
  }, [tasks, todoRedux])

  useEffect(() => {
    loadBloackchain()
    setTasks(todoRedux?.todos)
  }, []);
  return (
    <div className="App">
      Your account is {account} and your balance is {balance} ethers
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createTask(textValue.current?.value)
          }}
        >
          <div style={{ display: "flex", marginTop: "4rem", justifyContent: "center" }} >
            <label style={{ marginTop: "0.5rem", marginRight: "1rem" }} >Task Name :</label>
            <input
              style={style}
              type="createTask"
              placeholder="Create Task"
              aria-label="Create Task"
              required
              ref={textValue}
            />
          </div>
          <button type="submit" >Create</button>
        </form>

      </div>
    </div>
  );
}

export default App;
