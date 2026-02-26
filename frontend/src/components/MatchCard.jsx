function MatchCard({ match }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="font-bold">
        {match.offeredSkill?.title} ↔ {match.neededSkill?.title}
      </h3>
      <p>Status: {match.status}</p>
    </div>
  );
}

export default MatchCard;