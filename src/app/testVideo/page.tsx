export default function TestVideo() {
  return (
    <video autoPlay loop playsInline muted controls>
      <source src="/1.mp4" type="video/mp4" />
    </video>
  );
}