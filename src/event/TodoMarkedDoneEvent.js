const { CQRSExport } = require('inceptum');

const AggregateEvent = CQRSExport.Event.AggregateEvent;

class TodoMarkedDoneEvent extends AggregateEvent {
  apply(aggregate) {
    aggregate.status = 'Done';
  }
}

AggregateEvent.registerEventClass(TodoMarkedDoneEvent);

module.exports = { TodoMarkedDoneEvent };
