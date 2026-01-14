export default function UserList({ users }) {
    return (
      <table>
        {users.map(u => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
          </tr>
        ))}
      </table>
    );
  }
  