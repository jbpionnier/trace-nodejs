var debug = require('debug')('risingstack/trace')

var v8profiler = require('../../../optionalDependencies/v8-profiler')

function MemoryProfiler (options) {
  var _this = this
  this.name = 'Profiler/Memory'
  this.collectorApi = options.collectorApi
  this.controlBus = options.controlBus

  this.controlBus.on('memory-heapdump', function (command) {
    _this.sendSnapshot(command)
  })
}

MemoryProfiler.prototype.sendSnapshot = function (command) {
  var _this = this
  var now = Date.now()
  var snapshot = v8profiler.takeSnapshot()

  snapshot && snapshot.export(function (error, result) {
    if (error) {
      return debug(error)
    }

    _this.collectorApi.sendMemorySnapshot({
      heapSnapshot: result,
      time: now,
      commandId: command.id
    }, function () {
      snapshot.delete()
    })
  })
}

function create (options) {
  return new MemoryProfiler(options)
}

module.exports.create = create
