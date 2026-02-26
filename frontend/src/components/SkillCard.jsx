function SkillCard({ skill }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">{skill.title}</h3>
      <p>{skill.category}</p>
      <p className="text-sm text-gray-500">{skill.level}</p>
      <p className="mt-2">{skill.description}</p>
    </div>
  );
}

export default SkillCard;