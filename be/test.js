const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Delayed by ${ms} milliseconds`);
      }, ms);
    });
  };
  
  const asyncFunction = async () => {
    console.log("Start");
    const message = await delay(2000); // Wait for 2 seconds
    console.log(message); // Logs after 2 seconds
    console.log("End");
  };
  
  asyncFunction();
  