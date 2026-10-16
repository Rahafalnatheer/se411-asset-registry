export const teamMembers = [
  { name: 'Rahaf Alnatheer', studentId: '222411035' },
  { name: 'Fay Alsubaie', studentId: '222410396' },
  { name: 'Aljawaharah Alsaeegh', studentId: '22241096' },
]

export default function About() {
  return (
    <section>
      <h1>About</h1>
      <p className="muted lead">
        Computer Asset Registry is the Part 1 frontend for SE411 (Fall 2026–27). It manages a company&apos;s computers:
        add, view, update and delete, with data held in memory.
      </p>
      <h2>Our team</h2>
      <div className="table-wrap narrow">
        <table aria-label="Team members">
          <thead>
            <tr><th>Name</th><th>Student ID</th></tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => (
              <tr key={m.studentId}><td>{m.name}</td><td>{m.studentId}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
