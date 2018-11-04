//@ts-check
'use strict'

function doSomething(name) {
    console.log('Hello, ' + name);
}

doSomething('asdf')
  
function loggingDecorator(wrapped) {
    return function() {
        console.log('Starting');
        const result = wrapped.apply(this, arguments);
        console.log('Finished');
        return result;
    }
}

function loggingDecorator2(wrapped) {
    return (x)=>{
        console.log('Starting');
        wrapped(x)
        console.log('Finished');
    }
}


@log()
@immutable()
class Example{
    @time('demo');
    doSomethingExp(){

    }
}


if (require.main === module) {
    const wrapped = loggingDecorator(doSomething);

    const wrapped2 = loggingDecorator2(doSomething);

    // wrapped('asdf');
    // wrapped2('asdf2');


}