const { CQRSExport } = require('inceptum');
const { TodoCreatedEvent } = require('../event/TodoCreatedEvent');

const Command = CQRSExport.Command.Command;
const AggregateCreatingCommand = CQRSExport.Command.AggregateCreatingCommand;

class CreateTodoCommand extends AggregateCreatingCommand {
  constructor(obj) {
    obj.aggregateType = 'Todo';
    super(obj);
    this.copyFrom(obj, ['title', 'description']);
  }
  doExecute(executionContext) {
    executionContext.commitEvent(TodoCreatedEvent.fromCommand(this));
  }
  validate() {
    if (!this.title) {
      throw new Error('Need to specify a title for the Todo');
    }
    if (!this.description) {
      throw new Error('Need to specify a description for the Todo');
    }
  }
  validateAuth() {
    if (this.issuerAuth.getType() !== 'user') {
      throw new Error(`Only users can execute this command. Provided auth for an entity of type ${this.issuerAuth.getType()}`);
    }
  }
}

Command.registerCommandClass(CreateTodoCommand);

module.exports = { CreateTodoCommand };
