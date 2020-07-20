let recipients, subject, body, id, element, btnName
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // document.querySelector('#mail-newDiv').addEventListener('click', open_mail(`${id}`));

  // By default, load the inbox
  load_mailbox('inbox');

})

function compose_email() {
    debugger;
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#open-email').style.display = 'none';
      // document.querySelector('#reply-view').style.display = 'none';

      document.querySelector('#compose-recipients').value = '';
      document.querySelector('#compose-subject').value = '';
      document.querySelector('#compose-body').value = '';

    document.querySelector('#compose-form').onsubmit = () => {

    recipients = document.querySelector('#compose-recipients').value;
    subject = document.querySelector('#compose-subject').value;
    body = document.querySelector('#compose-body').value;

    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
    })
    .then(res => res.json())
    .then(result => {
        console.log(result)
    })

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  location.replace('http://127.0.0.1:8000/');

    return false;
  }
}

// To archive an email
function archive(id) {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
}

// Unarchiving a mail
function unarchive(id) {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
}
  
// To mark read and unread
function read(id) {
  fetch(`emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true 
    })
  })
}

function load_mailbox(mailbox) {
debugger;
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#open-email').style.display = 'none';
  // document.querySelector('#reply-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  console.log("Above fetch")
  fetch(`emails/${mailbox}`)
  .then((response) => response.json())
  .then((emails) => {
  emails.forEach((element) => {
    
    const newDiv = document.createElement('div');
    newDiv.style.border = '1px solid black';
    newDiv.style.padding = '10px';
    newDiv.style.marginBottom = '5px';
    newDiv.style.borderRadius = '10px';
    newDiv.id = `mail-newDiv-${element.id}`;
    newDiv.innerHTML = `<div><b>${element.sender}</b>  ${element.subject} <div id="timestamp">${element.timestamp}</div></div>`;
    document.querySelector('#emails-view').appendChild(newDiv);
    
    document.querySelector(`#mail-newDiv-${element.id}`).addEventListener("click", function () {
      open_mail(element.id, mailbox);
    });
    
    if(element.read === true) {
      newDiv.style.backgroundColor = '#99989861';
    }
    else {
      newDiv.style.backgroundColor = 'white';
    }
  })
})
  .catch((error) => {
    document.querySelector('#emails-view').innerHTML = error;
  })
 }


// Function to read the mail
 function open_mail(id, mailbox) {
   document.querySelector('#open-email').innerHTML = "";

  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#open-email').style.display = 'block';


   // Calling the read function
   read(id)
   if (mailbox === "archive") {
     btnName = "Unarchive";
   }
   else {
     btnName = "Archive";
   }
   fetch(`emails/${id}`)
   .then(response => response.json())
   .then(data => {
     // New div for displaying the contents of the mail
    //  document.querySelector('#open-mail').innerHTML = "";
     const view_email = document.createElement('div')
     view_email.className = "content-div";
     view_email.innerHTML = `<div>
     <p><b>Sender:</b> ${data.sender}</p>
     <p><b>Recipients: </b>${data.recipients}</p>
     <p><b>Timestamp: </b>${data.timestamp}</p>
     <p><b>Subject: </b>${data.subject}</p>
     <br>
     <p>${data.body}</p>
     <button class="btn btn-sm btn-outline-primary" id="replyBtn">Reply</button>
     <button class="btn btn-sm btn-outline-primary" id="archiveBtn">${btnName}</button>
     </div>`

     document.querySelector('#open-email').appendChild(view_email)
     
     document.querySelector('#archiveBtn').onclick = () => {
       if (mailbox === "archive") {
        unarchive(id);   
       }
       else {
        archive(id);
       }
       location.replace('http://127.0.0.1:8000/');
    }
    document.querySelector('#replyBtn').onclick = () => {
      reply_email(data.sender, data.body, data.subject, data.timestamp);
    }
  })
}

function reply_email(sender, body, subject, timestamp) {
  compose_email()
  document.querySelector("#compose-recipients").value = sender;
  document.querySelector("#compose-subject").value = `Re: ${subject}`;

  pre_fill = `On ${timestamp} ${sender} wrote:\n${body}\n`;

  document.querySelector("#compose-body").value = pre_fill;
}