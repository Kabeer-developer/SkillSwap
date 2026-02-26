import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSkills } from "../features/skills/skillsSlice";
import SkillCard from "../components/SkillCard";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();
  const { skills, loading } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Skills</h1>

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