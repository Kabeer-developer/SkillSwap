import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function SkillDetails() {
  const { id } = useParams();
  const { skills } = useSelector((state) => state.skills);

  const skill = skills.find((s) => s._id === id);

  if (!skill) return <div className="p-6">Skill not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{skill.title}</h2>
      <p>Category: {skill.category}</p>
      <p>Level: {skill.level}</p>
      <p className="mt-4">{skill.description}</p>
    </div>
  );
}

export default SkillDetails;