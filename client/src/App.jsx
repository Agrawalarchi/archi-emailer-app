import { useState, useEffect } from "react"
import Loader from "./loader";
const apiUrl = import.meta.env.VITE_API_URL;
import "./App.css";


export default function App(){
  const [val, setValid]  = useState("");
  const [loading, setLoading] = useState(false);
  const [emailId, setEMailId] = useState([]);
  const [secretkey, setSecretKey] = useState("");
  const [entries, setEnteries] = useState([]);


  async function trgrSubmitEnteries() {
    try{
       setLoading(true);  
        const unp = await fetch(`${apiUrl}/enteries`,{
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emails: emailId, secretKey:secretkey}) 
        });
        const pr = await unp.json();  
        if(pr.status === false){
           alert("Error: " + pr.message);
        } 
        else{
          alert("Enteries submitted successfully");
          setEMailId([]);
        } 
    }
    catch(err){
      console.error(err);
    } 
    finally{
      setLoading(false);
    } 
  }

  async function trgrSendMail() {
    try{
       setLoading(true);
       const unp = await fetch( `${apiUrl}/send`,{
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({secretKey:secretkey})
       });
       const pr = await unp.json();
       console.log(pr);
       if(pr.status === false){
          alert("Error: " + pr.message);
       }
       else{
        setLoading(false);
         alert("Emails sent successfully");
         setEMailId([]);
       }
    }
    catch(err){
      console.error(err);
    } 
    finally{
      setLoading(false);
    } 
  }

  function trgrAddEmail(e){
    e.preventDefault();

    if(!val || !val.includes("@")){
      alert("Enter valid email");
      return;
    }

    if(emailId.includes(val)){
      alert("Duplicate email");
      return;
    }

    setEMailId([...emailId, val.trim()]);
    setValid("");
  }


  async function fetchData(){
    try{
      const unp = await fetch(`${apiUrl}/`, { method: "GET",headers: { "Content-Type": "application/json" }});
      const pr = await unp.json();
      setEnteries(pr.body);
    }
    catch(err){
      console.error(err);
    }   
  }
  useEffect(() =>{
    fetchData();
  },[]);
  
  return(
    <main>
          <input value={secretkey} placeholder="Secret Key" onChange={(e) => setSecretKey(e.target.value)} />
          {
          (loading)?<Loader />:
          (<>
             <form>
               <label>Mail Sender</label><br/><br/>
               <input name="email" value={val} placeholder="xyz@gmail.com" onChange={(e) => setValid(e.target.value)} /><br/><br/>
               <button type="submit" onClick={trgrAddEmail}>Add</button>
             </form>
             <br/><br/>
          <ul>
             {emailId.map((email, index) => <li key={index}>{email}</li>)}
          </ul>
          </>
          )
       }
       <div className="button-list">
         <button onClick={trgrSubmitEnteries}>Submit enteries</button>
         <button onClick={trgrSendMail}>Send Mails</button>
       </div>
       <h1 className="database-heading">Database : {entries.length}</h1>
       <ol className="database-list">
          {
             (entries.length > 0) ? (
               entries.map((email, index) => <li key={index}>{email.email}</li>)
             ) : (
               <li>No emails found</li>
             )
           }
       </ol>
    </main>
  )
}