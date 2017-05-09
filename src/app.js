const { InceptumSwaggerApp, CQRSExport, IoCExport } = require('inceptum');
const path = require('path');

const swaggerFilePath = path.resolve(`${__dirname}/../config/swagger.yaml`);

const inceptum = new InceptumSwaggerApp(swaggerFilePath);
const context = inceptum.getContext();

context.registerSingletonsInDir(path.resolve(`${__dirname}/controller`));
context.registerSingletonsInDir(path.resolve(`${__dirname}/service`));
context.requireFilesInDir(path.resolve(`${__dirname}/command`));
context.requireFilesInDir(path.resolve(`${__dirname}/event`));

const CQRS = CQRSExport.CQRS;
const InMemoryAggregateEventStore = CQRSExport.Event.Store.InMemoryAggregateEventStore;
const PreinstantiatedSingletonDefinition = IoCExport.ObjectDefinition.PreinstantiatedSingletonDefinition;

const cqrs = new CQRS(new InMemoryAggregateEventStore());
context.registerDefinition(new PreinstantiatedSingletonDefinition(cqrs, 'CQRS'));

inceptum.start();

module.exports = inceptum; // for testing
