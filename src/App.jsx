import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  // =========================
  // STATES
  // =========================

  const [showPortal, setShowPortal] = useState(false);

  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [knowledge, setKnowledge] = useState("");

  const [employees, setEmployees] = useState([]);

  const [error, setError] = useState("");

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  // =========================
  // FETCH EMPLOYEES
  // =========================

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
      console.log("Error fetching employees:", error);
    }
  };


  // =========================
  // ADD EMPLOYEE
  // =========================

  const addEmployee = async (e) => {
    e.preventDefault();

    if (
      employeeName.trim() === "" ||
      employeeRole.trim() === "" ||
      knowledge.trim() === ""
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
          knowledge: knowledge,
        }
      );

      setEmployees([
        ...employees,
        response.data,
      ]);

      // Clear form
      setEmployeeName("");
      setEmployeeRole("");
      setKnowledge("");
      setError("");

    } catch (error) {
      console.log("Error adding employee:", error);
      setError("Failed to add employee");
    }
  };


  // =========================
  // DELETE EMPLOYEE
  // =========================

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
      console.log("Error deleting employee:", error);
    }
  };


  // =========================
  // EDIT EMPLOYEE
  // =========================

  const editEmployee = (employee) => {
    setEmployeeName(employee.name);
    setEmployeeRole(employee.role);
    setKnowledge(employee.knowledge);

    setEditId(employee._id);
    setIsEditing(true);

    setError("");
  };


  // =========================
  // UPDATE EMPLOYEE
  // =========================

  const updateEmployee = async (e) => {
    e.preventDefault();

    if (
      employeeName.trim() === "" ||
      employeeRole.trim() === "" ||
      knowledge.trim() === ""
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
          knowledge: knowledge,
        }
      );

      const updatedEmployees = employees.map(
        (employee) =>
          employee._id === editId
            ? response.data
            : employee
      );

      setEmployees(updatedEmployees);

      // Clear form
      setEmployeeName("");
      setEmployeeRole("");
      setKnowledge("");

      setEditId(null);
      setIsEditing(false);
      setError("");

    } catch (error) {
      console.log("Error updating employee:", error);
      setError("Failed to update employee");
    }
  };


  // =========================
  // AI KNOWLEDGE CHATBOT
  // =========================

  const askAI = () => {
    if (question.trim() === "") {
      setAnswer("Please ask a question");
      return;
    }

    const lowerQuestion = question
      .toLowerCase()
      .replace(/[?.,!]/g, "");

    // Common words that should not be used
    // as knowledge-search keywords
    const stopWords = [
      "who",
      "what",
      "where",
      "when",
      "which",
      "how",
      "does",
      "do",
      "is",
      "are",
      "the",
      "a",
      "an",
      "has",
      "have",
      "know",
      "knows",
      "experience",
      "with",
      "about",
      "employee",
      "employees",
      "person",
      "people",
      "someone",
      "anyone",
      "can",
      "could",
      "tell",
      "me",
      "please",
      "show",
      "find",
      "for",
      "in",
      "on",
      "of",
      "to",
      "and"
    ];

    // Extract meaningful keywords
    const keywords = lowerQuestion
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 &&
          !stopWords.includes(word)
      );

    // Search employees
    const matchedEmployees = employees.filter(
      (employee) => {
        const employeeData = `
          ${employee.name}
          ${employee.role}
          ${employee.knowledge}
        `.toLowerCase();

        return keywords.some((keyword) =>
          employeeData.includes(keyword)
        );
      }
    );

    // If matching employees are found
    if (matchedEmployees.length > 0) {
      const results = matchedEmployees
        .map(
          (employee) =>
            `${employee.name} (${employee.role}) has relevant knowledge: ${employee.knowledge}`
        )
        .join("\n\n");

      setAnswer(results);
    } else {
      setAnswer(
        "No matching company knowledge found."
      );
    }
  };


  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEmployeeName("");
    setEmployeeRole("");
    setKnowledge("");

    setEditId(null);
    setIsEditing(false);
    setError("");
  };


  // =========================
  // MAIN UI
  // =========================

  return (
    <>
      {!showPortal ? (

        // ==================================================
        // HOME PAGE
        // ==================================================

        <div>

          {/* NAVBAR */}

          <nav className="navbar">

            <h1 className="logo">
              IntellectMerge
            </h1>

            <ul className="nav-links">

              <li>
                <a href="#home">
                  Home
                </a>
              </li>

              <li>
                <a href="#features">
                  Features
                </a>
              </li>

              <li>
                <a href="#workflow">
                  Workflow
                </a>
              </li>

              <li>
                <a href="#contact">
                  Contact
                </a>
              </li>

            </ul>

          </nav>


          {/* HERO SECTION */}

          <section
            className="hero"
            id="home"
          >

            <div className="hero-content">

              <h2>
                Preserve Company
                <br />
                Knowledge with AI
              </h2>

              <p>
                IntellectMerge helps organizations
                preserve employee knowledge using
                Artificial Intelligence and
                Retrieval-Augmented Generation (RAG).
              </p>

              <button
                className="start-btn"
                onClick={() =>
                  setShowPortal(true)
                }
              >
                Get Started
              </button>

            </div>


            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                alt="Artificial Intelligence"
              />

            </div>

          </section>


          {/* FEATURES */}

          <section
            className="features"
            id="features"
          >

            <h2>
              Core Features
            </h2>

            <div className="feature-container">

              <div className="feature-card">

                <h3>
                  AI Chatbot
                </h3>

                <p>
                  Ask company-related questions
                  and retrieve relevant employee
                  knowledge instantly.
                </p>

              </div>


              <div className="feature-card">

                <h3>
                  Knowledge Storage
                </h3>

                <p>
                  Store employee knowledge,
                  work experience, documents
                  and company workflows.
                </p>

              </div>


              <div className="feature-card">

                <h3>
                  Smart Search
                </h3>

                <p>
                  Search employee knowledge
                  quickly using names, roles
                  and technical skills.
                </p>

              </div>

            </div>

          </section>


          {/* WORKFLOW */}

          <section
            className="workflow"
            id="workflow"
          >

            <h2>
              How IntellectMerge Works
            </h2>

            <div className="workflow-container">

              <div className="workflow-step">

                <h3>
                  1. Upload Data
                </h3>

                <p>
                  Employee knowledge and
                  company information are
                  added to the platform.
                </p>

              </div>


              <div className="workflow-step">

                <h3>
                  2. AI Processing
                </h3>

                <p>
                  The information is organized
                  and prepared for efficient
                  knowledge retrieval.
                </p>

              </div>


              <div className="workflow-step">

                <h3>
                  3. Smart Retrieval
                </h3>

                <p>
                  Employees can search and ask
                  questions to retrieve relevant
                  company knowledge.
                </p>

              </div>

            </div>

          </section>


          {/* FOOTER */}

          <footer
            className="footer"
            id="contact"
          >

            <h3>
              IntellectMerge
            </h3>

            <p>
              AI-Powered Knowledge Preservation
              Platform
            </p>

            <p>
              © 2026 IntellectMerge | MERN Stack Project
            </p>

          </footer>

        </div>

      ) : (

        // ==================================================
        // EMPLOYEE KNOWLEDGE PORTAL
        // ==================================================

        <div className="portal-container">

          <h1 className="portal-title">
            Employee Knowledge Portal
          </h1>

          <p className="portal-subtitle">
            Add employees into the IntellectMerge
            knowledge system
          </p>


          {/* =========================
              EMPLOYEE FORM
          ========================= */}

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
                setEmployeeName(
                  e.target.value
                )
              }
            />


            <input
              type="text"
              placeholder="Enter Employee Role"
              value={employeeRole}
              onChange={(e) =>
                setEmployeeRole(
                  e.target.value
                )
              }
            />


            <textarea
              placeholder="Enter Employee Knowledge / Documents"
              value={knowledge}
              onChange={(e) =>
                setKnowledge(
                  e.target.value
                )
              }
            />


            <button type="submit">

              {isEditing
                ? "Update Employee"
                : "Add Employee"}

            </button>


            {/* CANCEL EDIT BUTTON */}

            {isEditing && (

              <button
                type="button"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>

            )}

          </form>


          {/* =========================
              ERROR MESSAGE
          ========================= */}

          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          {/* =========================
              AI CHATBOT
          ========================= */}

          <div className="chatbot-container">

            <h2>
              AI Knowledge Chatbot
            </h2>

            <p>
              Ask questions about employee
              skills and company knowledge.
            </p>


            <input
              type="text"
              placeholder="Example: Who knows React?"
              value={question}
              onChange={(e) =>
                setQuestion(
                  e.target.value
                )
              }
            />


            <button
              className="ask-btn"
              onClick={askAI}
            >
              Ask AI
            </button>


            {answer && (

              <div className="answer-box">

                <p>
                  {answer}
                </p>

              </div>

            )}

          </div>


          {/* =========================
              SEARCH
          ========================= */}

          <input
            type="text"
            placeholder="Search Knowledge..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="search-bar"
          />


          {/* =========================
              EMPLOYEE LIST
          ========================= */}

          <div className="employee-list">

            {employees.length === 0 ? (

              <p className="empty-message">
                No Employees Added
              </p>

            ) : (

              employees
                .filter((employee) => {

                  const searchText =
                    search.toLowerCase();

                  return (
                    employee.name
                      .toLowerCase()
                      .includes(searchText) ||

                    employee.role
                      .toLowerCase()
                      .includes(searchText) ||

                    employee.knowledge
                      .toLowerCase()
                      .includes(searchText)
                  );

                })

                .map((employee) => (

                  <div
                    className="employee-card"
                    key={employee._id}
                  >

                    <h3>
                      {employee.name}
                    </h3>

                    <p>
                      {employee.role}
                    </p>


                    <div className="knowledge-box">

                      <h4>
                        Stored Knowledge
                      </h4>

                      <p>
                        {employee.knowledge}
                      </p>

                    </div>


                    {/* BUTTONS */}

                    <div className="button-group">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editEmployee(
                            employee
                          )
                        }
                      >
                        Edit
                      </button>


                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteEmployee(
                            employee._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))

            )}

          </div>


          {/* =========================
              BACK BUTTON
          ========================= */}

          <button
            className="back-btn"
            onClick={() =>
              setShowPortal(false)
            }
          >
            Back to Home
          </button>

        </div>

      )}

    </>
  );
}

export default App;