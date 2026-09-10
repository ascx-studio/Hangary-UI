import Container from '@/layout/Container';

export default function page() {
  return (
    <Container  className="min-h-[90dvh] p-4 md:p-5 mx-auto flex items-center">
        <h1 className="text-7xl font-bold text-center">
          Collection of
          <br /> components, blocks, sections
          <br /> and utilites made for reuse.
        </h1>

    </Container>
  );
}
