require('dotenv').config({ path: '.env.test' });

const setup = async () => {
  console.log(process.env.TABLE_NAME);
};

export default setup;
