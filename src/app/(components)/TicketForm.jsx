"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TicketForm = ({ ticket }) => {
  console.log("ticket", ticket);
  const EDITMODE = ticket?._id === "new" ? false : !!ticket?._id;
  const router = useRouter();
  const [error, setError] = useState(null);

  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "general",
  };

  if (EDITMODE && ticket) {
    startingTicketData["title"] = ticket.title || "";
    startingTicketData["description"] = ticket.description || "";
    startingTicketData["priority"] = ticket.priority || 1;
    startingTicketData["progress"] = ticket.progress || 0;
    startingTicketData["status"] = ticket.status || "not started";
    startingTicketData["category"] = ticket.category || "general";
  }

  const [formData, setFormData] = useState(startingTicketData);

  const handleChange = (e) => {
    const value =
      e.target.name === "priority" || e.target.name === "progress"
        ? parseInt(e.target.value)
        : e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let res;
      if (EDITMODE) {
        res = await fetch(`/api/Tickets/${ticket._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/Tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || `Failed to ${EDITMODE ? "update" : "create"} ticket. Please try again.`);
        return;
      }

      if (!EDITMODE) {
        setFormData(startingTicketData);
      }
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Submit error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (ticket?._id === "not-found") {
    return <div className="text-center text-red-500">Ticket not found.</div>;
  }

  return (
    <div className="flex justify-center">
      <form
        className="flex flex-col gap-2 w-1/2"
        method="POST"
        onSubmit={handleSubmit}
      >
        <h3 className="text-center">
          {EDITMODE ? "Update Your Ticket" : "Create Your Ticket"}
        </h3>
        {error && <p className="text-red-500">{error}</p>}
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={handleChange}
          required
          aria-required="true"
          value={formData.title}
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          onChange={handleChange}
          required
          aria-required="true"
          value={formData.description}
          rows="5"
        ></textarea>

        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          onChange={handleChange}
          value={formData.category}
        >
          <option value="general">General</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
        </select>

        <label>Priority</label>
        <div>
          {[1, 2, 3, 4, 5].map((priority) => (
            <React.Fragment key={priority}>
              <input
                name="priority"
                id={`priority-${priority}`}
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority === priority}
              />
              <label htmlFor={`priority-${priority}`}>{priority}</label>
            </React.Fragment>
          ))}
        </div>

        <label htmlFor="progress">Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          min="0"
          max="100"
          value={formData.progress}
          onChange={handleChange}
        />

        <label htmlFor="status">Status</label>
        <select
          name="status"
          id="status"
          onChange={handleChange}
          value={formData.status}
        >
          <option value="not started">Not Started</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="submit"
          className="btn"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
          aria-label="Submit ticket form"
        />
      </form>
    </div>
  );
};

export default TicketForm;