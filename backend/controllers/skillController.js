const Skill = require("../models/Skill");

// Create skill
exports.createSkill = async (req, res) => {
  try {
    const { title, category, level, description } = req.body;

    const skill = await Skill.create({
      title,
      category,
      level,
      description,
      postedBy: req.user.id,
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all skills (with filters)
exports.getSkills = async (req, res) => {
  try {
    const { category, level, location } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (level) filter.level = level;

    const skills = await Skill.find(filter).populate("postedBy", "name location");

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single skill
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate("postedBy", "name location");

    if (!skill) return res.status(404).json({ message: "Skill not found" });

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};