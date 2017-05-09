const { CQRSExport } = require('inceptum');
const { TodoMarkedDoneEvent } = require('../event/TodoMarkedDoneEvent');

const Command = CQRSExport.Command.Command;
const AggregateCommand = CQRSExport.Command.AggregateCommand;

class MarkTodoDoneCommand extends AggregateCommand {
  doExecute(executionContext) {
    executionContext.commitEvent(new TodoMarkedDoneEvent({ aggregateId: this.getAggregateId(), issuerCommandId: this.getCommandId() }));
  }
  validateAuth(executionContext, aggregate) {
    const roles = this.getRolesForAggregate(aggregate);
    if (roles.indexOf('creator') < 0) {
      throw new Error('Only the creator of the Todo can mark it as done');
    }
  }
  validate(executionContext, aggregate) {
    if (aggregate.status !== 'NotDone') {
      throw new Error('Aggregate is not currently in NotDone');
    }
  }
}

Command.registerCommandClass(MarkTodoDoneCommand);

module.exports = { MarkTodoDoneCommand };
