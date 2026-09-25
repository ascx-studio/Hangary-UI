import * as motion from "motion/react-client";

function Items({ Number = "", title, des = "", headingTag = "h2" }: any) {
  const Heading = headingTag;
  return (
    <motion.div
      className="space-y-4 mb-16 "
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="border-l-4 border-blue-500 pl-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading className="text-4xl md:text-5xl font-bold text-white">
          <span className=" text-blue-500">{Number}. </span>
          {title}
        </Heading>
      </motion.div>
      <p className="text-gray-400 max-w-xl text-lg">{des}</p>
    </motion.div>
  );
}

export default Items;
