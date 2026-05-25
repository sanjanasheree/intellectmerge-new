import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {

  const [showPortal, setShowPortal] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");

  const [employees, setEmployees] = useState([]);

  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);


  // FETCH EMPLOYEES
  useEffect(() => {

    fetchEmployees();

  }, []);


  const fetchEmployees = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/employees"
      );

      setEmployees(response.data);

    } catch (error) {

      console.log(error);
    }
  };


  // ADD EMPLOYEE
  const addEmployee = async (e) => {

    e.preventDefault();

    if (
      employeeName.trim() === "" ||
      employeeRole.trim() === ""
    ) {

      setError("Please fill all fields");

      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/api/employees",
        {
          name: employeeName,
          role: employeeRole,
        }
      );

      setEmployees([
        ...employees,
        response.data,
      ]);

      setEmployeeName("");
      setEmployeeRole("");

      setError("");

    } catch (error) {

      console.log(error);
    }
  };


  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/employees/${id}`
      );

      setEmployees(
        employees.filter(
          (employee) => employee._id !== id
        )
      );

    } catch (error) {

      console.log(error);
    }
  };


  // EDIT EMPLOYEE
  const editEmployee = (employee) => {

    setEmployeeName(employee.name);

    setEmployeeRole(employee.role);

    setEditId(employee._id);

    setIsEditing(true);
  };


  // UPDATE EMPLOYEE
  const updateEmployee = async (e) => {

    e.preventDefault();

    if (
      employeeName.trim() === "" ||
      employeeRole.trim() === ""
    ) {

      setError("Please fill all fields");

      return;
    }

    try {

      const response = await axios.put(
        `http://localhost:5000/api/employees/${editId}`,
        {
          name: employeeName,
          role: employeeRole,
        }
      );

      const updatedEmployees =
        employees.map((employee) =>

          employee._id === editId
            ? response.data
            : employee
        );

      setEmployees(updatedEmployees);

      setEmployeeName("");

      setEmployeeRole("");

      setEditId(null);

      setIsEditing(false);

      setError("");

    } catch (error) {

      console.log(error);
    }
  };


  return (
    <>

      {!showPortal ? (

        <div>

          {/* NAVBAR */}
          <nav className="navbar">

            <h1 className="logo">
              IntellectMerge
            </h1>

            <ul className="nav-links">

              <li>
                <a href="#home">Home</a>
              </li>

              <li>
                <a href="#features">Features</a>
              </li>

              <li>
                <a href="#workflow">Workflow</a>
              </li>

              <li>
                <a href="#contact">Contact</a>
              </li>

            </ul>

          </nav>


          {/* HERO SECTION */}
          <section className="hero" id="home">

            <div className="hero-content">

              <h2>
                Preserve Company
                <br />
                Knowledge with AI
              </h2>

              <p>
                IntellectMerge helps organizations preserve
                employee knowledge using Artificial Intelligence
                and Retrieval-Augmented Generation (RAG).
              </p>

              <button
                className="start-btn"
                onClick={() => setShowPortal(true)}
              >
                Get Started
              </button>

            </div>

            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                alt="AI"
              />

            </div>

          </section>


          {/* FEATURES */}
          <section className="features" id="features">

            <h2>Core Features</h2>

            <div className="feature-container">

              <div className="feature-card">

                <h3>AI Chatbot</h3>

                <p>
                  Ask company-related questions and receive
                  AI-generated answers instantly.
                </p>

              </div>

              <div className="feature-card">

                <h3>Knowledge Storage</h3>

                <p>
                  Store employee documents, notes and
                  company workflows securely.
                </p>

              </div>

              <div className="feature-card">

                <h3>Smart Search</h3>

                <p>
                  Retrieve accurate information from the
                  AI knowledge base quickly.
                </p>

              </div>

            </div>

          </section>


          {/* WORKFLOW */}
          <section className="workflow" id="workflow">

            <h2>How IntellectMerge Works</h2>

            <div className="workflow-container">

              <div className="workflow-step">

                <h3>1. Upload Data</h3>

                <p>
                  Company documents and employee knowledge
                  are uploaded into the platform.
                </p>

              </div>

              <div className="workflow-step">

                <h3>2. AI Processing</h3>

                <p>
                  AI processes and organizes information
                  into a searchable RAG knowledge base.
                </p>

              </div>

              <div className="workflow-step">

                <h3>3. Smart Retrieval</h3>

                <p>
                  Employees can ask questions and instantly
                  retrieve company knowledge.
                </p>

              </div>

            </div>

          </section>


          {/* FOOTER */}
          <footer className="footer" id="contact">

            <h3>IntellectMerge</h3>

            <p>
              AI-Powered Knowledge Preservation Platform
            </p>

            <p>
              © 2026 IntellectMerge | MERN Stack Project
            </p>

          </footer>

        </div>

      ) : (

        <div className="portal-container">

          <h1 className="portal-title">
            Employee Knowledge Portal
          </h1>

          <p className="portal-subtitle">
            Add employees into the IntellectMerge AI system
          </p>


          {/* FORM */}
          <form
            className="employee-form"
            onSubmit={
              isEditing
                ? updateEmployee
                : addEmployee
            }
          >

            <input
              type="text"
              placeholder="Enter Employee Name"
              value={employeeName}
              onChange={(e) =>
                setEmployeeName(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Enter Employee Role"
              value={employeeRole}
              onChange={(e) =>
                setEmployeeRole(e.target.value)
              }
            />

            <button type="submit">

              {isEditing
                ? "Update Employee"
                : "Add Employee"}

            </button>

          </form>


          {/* VALIDATION */}
          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          {/* EMPLOYEE LIST */}
          <div className="employee-list">

            {employees.length === 0 ? (

              <p className="empty-message">
                No Employees Added
              </p>

            ) : (

              employees.map((employee) => (

                <div
                  className="employee-card"
                  key={employee._id}
                >

                  <h3>{employee.name}</h3>

                  <p>{employee.role}</p>

                  <div className="button-group">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editEmployee(employee)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEmployee(employee._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))
            )}

          </div>


          {/* BACK BUTTON */}
          <button
            className="back-btn"
            onClick={() => setShowPortal(false)}
          >
            Back to Home
          </button>

        </div>
      )}
    </>
  );
}

export default App;