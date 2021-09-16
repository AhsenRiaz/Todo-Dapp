import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type listType = {
    count: number,
    todos: {
        id: string,
        content: string,
        completed: boolean,
    }[]
} | null


export type StateType = {
    todos: null | listType
}
const initialState: StateType = {
    todos: null
}


const todoListSlice = createSlice({
    name: "Todos",
    initialState,
    reducers: {
        setTodo: (state, { payload }: PayloadAction<any>) => {
            state.todos = payload
            console.log("state.payload_setTodo" , payload)
            console.log("state.todos_SetTodo", state.todos)            
        },
        addTodo: (state, { payload }: PayloadAction<any>) => {
            if (state.todos) {
                state.todos.count += 1;
                const arr = [...state.todos.todos];
                arr.push(payload);
                state.todos = { ...state.todos, todos: arr };

            }
        }

    },
});

export default todoListSlice.reducer
export const { setTodo, addTodo } = todoListSlice.actions