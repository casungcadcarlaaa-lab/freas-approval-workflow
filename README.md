```markdown
**Freas Approval Workflow Management**

A web-based application designed to streamline and manage approval workflows for student reservations, facilities, and block dates efficiently.

🚀 Live Demo

The application is automatically deployed and accessible globally:
- Live Website: [https://freas-approval-workflow.vercel.app](https://freas-approval-workflow.vercel.app)

✨ Features

- Student & Admin Dashboards: Dedicated views for users submitting requests and admins approving them.
- Reservation Management: Streamlined system to track, approve, or deny facility requests.
- Block Dates Configuration: Administrative control to restrict scheduling on specific dates.
- Responsive Styling: Clean user interface built with customized CSS matching modern web standards.

🛠️ Tech Stack

*Frontend: HTML5, CSS3, JavaScript (ES6)
*Hosting & Deployment: Vercel
*Version Control: Git & GitHub

📂 Project Structure

```text
├── .vscode/               # Editor configurations
├── assets/                # Images, icons, and static assets
├── js/                    # JavaScript logic files
│   ├── pages/             # Page-specific routers and components (Admin, Student, Auth)
│   ├── app.js             # Main application configuration
│   └── router.js          # Client-side routing engine
├── styles/                # CSS Style sheets (main.css, style-v2.css)
├── index.html             # Application entry point
└── README.md              # Project documentation

```
🚀 Local Development

To run this project locally on your machine:

1. Clone the repository:
```bash
git clone [https://github.com/casungcadcarlaaa-lab/freas-approval-workflow.git](https://github.com/casungcadcarlaaa-lab/freas-approval-workflow.git)

```
2. **Navigate into the project directory:**
```bash
cd freas-approval-workflow

```
3. **Run a local server:**
Open `index.html` directly in your browser, or serve it using a local server extension (like Live Server in VS Code).

---
🤖 CI/CD Automation

This project utilizes a continuous deployment workflow connected via GitHub actions directly to **Vercel**. Any code pushed to the `main` branch automatically triggers a production rebuild and updates the live site instantly.

```
