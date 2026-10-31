/**
 * @description Single Trigger per Object architecture for Case.
 *              Delegates all execution directly to CaseTriggerHandler.
 */
trigger CaseTrigger on Case(before insert, before update) {
  if (Trigger.isBefore) {
    if (Trigger.isInsert) {
      CaseTriggerHandler.handleBeforeInsert(Trigger.new);
    } else if (Trigger.isUpdate) {
      CaseTriggerHandler.handleBeforeUpdate(Trigger.new, Trigger.oldMap);
    }
  }
}
