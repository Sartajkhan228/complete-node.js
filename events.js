import events from 'events';


const emitter = new events();


emitter.on("greet", (arg, arg1) => {
    console.log(`Hello there, ${arg} the ${arg1} works!`);
})

emitter.on("eventFuction", (arg) => {
    console.log(`User name is ${arg.name} and age is ${arg.age}`);
});


export default emitter;


