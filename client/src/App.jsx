import { useState } from "react"
const apiUrl = import.meta.env.VITE_API_URL;



export default function App(){
  const [val, setValid]  = useState("");
  const [emailId, setEMailId] = useState([]);
  const [secretkey, setSecretKey] = useState("");

  async function trgrSendMail() {
    try{
       const unp = await fetch(apiUrl,{
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ emails: emailId, secretKey:secretkey})
       });
       const pr = await unp.json();
       console.log(pr);
    }
    catch(err){
      console.error(err);
    }  
  }

  return(
    <main>
          <input value={secretkey} placeholder="Secret Key" onChange={(e) => setSecretKey(e.target.value)} />
          <form>
               <label>Mail Sender</label><br/><br/>
               <input name="email" value={val} placeholder="xyz@gmail.com" onChange={(e) => setValid(e.target.value)} /><br/><br/>
               <button type="submit" onClick={(e) => {
                  e.preventDefault();
                  setEMailId([...emailId, val]);
                  setValid("");
               }}>Add</button>
          </form><br/><br/>
          <ul>
             {emailId.map((email, index) => <li key={index}>{email}</li>)}
          </ul>
          <button onClick={trgrSendMail}>Send Email</button>
    </main>
  )
}