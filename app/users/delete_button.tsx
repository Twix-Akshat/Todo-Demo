
import { deleteUser } from "./deleteUser";

export default function DeleteButton({ id }: { id: number}) {
    return (
        <form action={deleteUser}>
            <input type="hidden" name="id" value={id} />
            <button type="submit">Delete</button>
        </form>
    );
}
