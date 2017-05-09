const { CQRSExport } = require('inceptum');

const AggregateCreatingEvent = CQRSExport.Event.AggregateCreatingEvent;

class TodoCreatedEvent extends AggregateCreatingEvent {
  constructor(obj) {
    obj.aggregateType = 'Todo';
    super(obj);
    this.copyFrom(obj, ['title', 'description', 'creator']);
  }
  apply(aggregate) {
    aggregate.title = this.title;
    aggregate.description = this.description;
    aggregate.status = 'NotDone';
    aggregate.aggregateRoles[this.creator] = 'creator';
  }
  static fromCommand(createTodoCommand) {
    return new TodoCreatedEvent({
      aggregateId: createTodoCommand.getAggregateId(),
      issuerCommandId: createTodoCommand.getCommandId(),
      title: createTodoCommand.title,
      description: createTodoCommand.description,
      creator: createTodoCommand.getIssuerAuth().getFullId()
    });
  }
}

AggregateCreatingEvent.registerEventClass(TodoCreatedEvent);

module.exports = { TodoCreatedEvent };
