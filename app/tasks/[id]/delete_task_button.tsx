import { deleteTask } from "../delete_task";


export default function DeleteButton({ id,user_id }: { id: number ,user_id:number}) {
    return (
        <form action={deleteTask}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="user_id" value={user_id}/>
            <button type="submit">Delete</button>
        </form>
    );
}
