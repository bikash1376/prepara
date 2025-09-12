# testsat
Checking..


![Project Screenshot](overview.png)
 

![Project Screenshot](dumb.png)

**testsat** is an online digital test platform.

## Tech Stack

- React
- Node.js
- Express
- MongoDB

## Setup Checklist

- [✔] Set up new React and Node.js projects  
- [✔] Install required dependencies  
- [✔] Create a basic Express server  
- [✔] Auth template setup  
- [✔] Establish database connection  
- [✔] CRUD routes template  
- [✔] Define test model
- [✔] Implement CRUD routes (using models)  
- [✔] Basic frontend to fetch tests
- [✔] Define admin model    
- [✔] Define Student model
- [✔] Add authentication (login/register)  
- [✔] Configure protected routes (JWT middleware)  
- [✔️] Build test creation and editing (Admin)  
- [✔️] Build test-taking functionality (Student)  
- [✔️] Implement score retrieval (Student)  
- [✔️] Test APIs with Postman/Thunder Client  
- [] Thank You Windsurf


...write frontend
- [✔] Connect frontend with backend APIs  



68b72105013cad49c0f91995
68b72078013cad49c0f91991


AS PER GPT: 

STUDENT 
- Home
- My Tests
- My Submissions
- Profile (Name, Image, Subscription type, Email, Password reset, About, Privacy Policy, Terms and conditions)
- Logout

PREMIUM
- More test sets
- Flashcards
- Guides
- Lessons
- Detailed Analytics



AFTER LOGIN
-Welcome (Name)
-Last test score
-Guides card (Guide name, button ("read guide"))
-Cards (Test svg icon,Test name, button ("take test"))



ADMIN
-Dashboard()
 -Card (Total students)
 -Card(Active today)
 -Card(Tests created, Tests taken)

-Test Management()
 -Create Test
 -Edit Test
 -Delete Test
-Student Management()
 -List of students (Name, email, Role, Subscription type, Last login, Actions(View (Student profile), Delete))
 -Filter By (Active, Inactive, Subscription type)
 -Search by name
-Submissions
 -List of tests(Button ("View Submissions"))
  -Submitted By (Name, time, score)
  -Filter



Problems : reloading http://localhost:5173/test-list sometimes doesn't show tests
Problems : Account deleted from admin dashboard should also delete from clerk

Problems (authorization??): testRoutes.post('/add', protect, isAdmin, addTest);
testRoutes.get('/all', getAllTests);
testRoutes.get('/with-status', protect, getAllTestsWithStatus);
testRoutes.get('/:id/access', protect, checkTestAccess);
testRoutes.get('/:id', getTestById);
testRoutes.put('/:id', protect, isAdmin, updateTest);
testRoutes.delete('/:id', protect, isAdmin, deleteTest);
