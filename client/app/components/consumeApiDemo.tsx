import { useEffect, useState } from "react";
import { User, Users } from "../datatypes/datatypes";

// inspo: https://www.youtube.com/watch?v=00lxm_doFYw
// ^ all so explains paging and race-conditions

const BASE_URL = 'http://127.0.0.1:8080/api'

function ConsumeApiDemo() {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false); // to avoid blank screen when awaiting
    const [users, setUsers] = useState<User[]>([])

    // GET request
    useEffect(() => {
        const fetchUsers = async() => {
            setIsLoading(true)
            // Error handling
            try {
                // Call the api and cast the response via json
                const response = await fetch(`${BASE_URL}/users`);
                const users = await response.json() as User[];
                console.log(response)
                setUsers(users)
            // We should probably handle this better 
            } catch (error: any) {
                setError(error)
            } finally {
                setIsLoading(false)
            }
        };

        fetchUsers();
    }, [])

    // // What to display when we are awaiting data
    // if (isLoading) {
    //     return <div>Loading ...</div>
    // }

    // display error
    if (error) {
        return (
            <div></div>
        );
    }

    // what to display when we have the data
    return (
        <div>
            <h1>All the users in the database</h1>
            {isLoading && (<div>Loading ...</div>)}
            {!isLoading && (
                <ul>
                {users.map((user) => {
                    return <li key={user.user_id}>{user.username} + {user.pwd} + {user.nationality} + {user.home_university}</li>
                })}
            </ul>
            )}
        </div>
    )
}


// function RegisterUserDemo() {
//     const saveGames = () => {
//         fetch('http://localhost:3000/user/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             name: formData, // Use your own property name / key
//           }),
//         })
//           .then((res) => res.json())
//           .then((result) => setData(result.rows))
//           .catch((err) => console.log('error'))
//       }
    
// }

export default ConsumeApiDemo