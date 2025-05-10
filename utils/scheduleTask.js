export default function scheduleTask(taskFn, args,sendDate){
    if(!sendDate || typeof(args) !== "array" || !taskFn) return;
    const delay = new Date(sendDate) - new Date();
    if (delay < 0) {
        console.error('Send date is in the past. Task will not be executed.');
        return;
    }
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
            try {
                const result = await taskFn(...args);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }, delay);
        return () => clearTimeout(timeout)
    });
}