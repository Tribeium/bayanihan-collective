const MENTORS = [
  { id: "mentor-1", name: "John Doe", specialization: "AI/ML", bio: "Mentors on model deployment and evaluation." },
  { id: "mentor-2", name: "Jane Smith", specialization: "Full-stack", bio: "Mentors on shipping end-to-end features." },
  { id: "mentor-3", name: "Alex Reyes", specialization: "Data Engineering", bio: "Mentors on dataset licensing and pipelines." },
  { id: "mentor-4", name: "Sam Cruz", specialization: "Governance & Mediation", bio: "Best contact for case and dispute questions." },
];

export default function AvailableMentors({ onMessageMentor }) {
  return (
    <div className="panel">
      <h2 className="panel__title">Available Mentors</h2>
      <p className="empty-state" style={{ marginBottom: "0.75rem" }}>
        Have a question beyond this module? Reach out to a mentor directly.
      </p>
      <ul className="mentor-list">
        {MENTORS.map((mentor) => (
          <li key={mentor.id} className="mentor-list__item">
            <div>
              <strong>{mentor.name}</strong>
              <span className="mentor-list__specialization"> · {mentor.specialization}</span>
              <p className="mentor-list__bio">{mentor.bio}</p>
            </div>
            <button className="btn" onClick={() => onMessageMentor?.(mentor)}>
              Message
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
