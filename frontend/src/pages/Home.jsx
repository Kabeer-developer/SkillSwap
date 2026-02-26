import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills, createSkill } from "../features/skills/skillsSlice";
import SkillCard from "../components/SkillCard";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();
  const { skills, loading } = useSelector((state) => state.skills);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "Beginner",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(createSkill(formData));
    setFormData({
      title: "",
      category: "",
      level: "Beginner",
      description: "",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Skills</h1>

      {/* Create Skill Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          placeholder="Title"
          className="border p-2 w-full"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        <input
          placeholder="Category"
          className="border p-2 w-full"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <select
          className="border p-2 w-full"
          value={formData.level}
          onChange={(e) =>
            setFormData({ ...formData, level: e.target.value })
          }
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>
        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <button className="bg-blue-500 text-white px-4 py-2">
          Add Skill
        </button>
      </form>

      {loading && <p>Loading skills...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <Link key={skill._id} to={`/skill/${skill._id}`}>
            <SkillCard skill={skill} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;