# chat-group
### authentication with social media and realtime chat with nodejs and mongodb database. 

![app review](https://github.com/enas48/chat-group/raw/main/public/images/app_review.png)

---
## demo
* [https://chat-group12.herokuapp.com/](https://chat-group12.herokuapp.com/)

---

## setup

* clone this repo to your local machine using [https://github.com/enas48/chat-group.git](https://github.com/enas48/chat-group.git)

* install the packages first `npm install`

* `npm run start`

* open your browser and run app  [http://127.0.0.1:3000](http://127.0.0.1:3000)

* in authStrategy remove comment from
```
 var absoluteUri="http://127.0.0.1:3000";
 ```
  and add comment to
  ``` 
  // var absoluteUri = 'https://chat-group12.herokuapp.com'; 
```
---
## features
* responsive webpages
* you can authenticate in app and users will save in databasee 
* you can authenticate with social media like (facebook -google- github).

* form validation before sent to database by ajax.

* in profile page 
  * you can go edit page and update your information and your avater image.

* in chat page 
  * you can see all users in app and show their profile 
  * you can see online state on user who are join the chat in sidebar.
  * notifcation when other user joined or left the chat.
  * notifcation when other user type a message
  ---
* ###  inspired by [@devchallengesio](https://devchallenges.io/challenges/UgCqszKR7Q7oqb4kRfI0)

