export default function Input({ label, error, ...props }) {
  return (
    <>
      <div className="control">
        <label>{label}</label>
        <input required {...props} />
        {error && <p className="error">Invalid input</p>}
      </div>
    </>
  );
}
