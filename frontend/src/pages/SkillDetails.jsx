import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createBarter } from "../features/barters/bartersSlice";

function SkillDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { skills } = useSelector((state) => state.skills);
  const { user } = useSelector((state) => state.auth);

  const skill = skills.find((s) => s._id === id);

  const mySkills = skills.filter(
  (s) => s.postedBy?._id === user._id
);

  const [selectedSkill, setSelectedSkill] = useState("");

  if (!skill) return <div className="p-6">Skill not found</div>;

  const handleRequest = async () => {
    if (!selectedSkill) return alert("Select your skill first");

    await dispatch(
      createBarter({
        receiverId: skill.postedBy,
        offeredSkill: selectedSkill,
        neededSkill: skill._id,
      })
    );

    navigate("/barters");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{skill.title}</h2>
      <p>Category: {skill.category}</p>
      <p>Level: {skill.level}</p>
      <p className="mt-4">{skill.description}</p>

      {skill.postedBy?._id !== user._id && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Request Barter</h3>

          <select
            className="border p-2 w-full mb-3"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Select your skill</option>
            {mySkills.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRequest}
            className="bg-green-500 text-white px-4 py-2"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}

export default SkillDetails;