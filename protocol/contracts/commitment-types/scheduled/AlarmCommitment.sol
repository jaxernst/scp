/**
 * An AlarmCommitment is a commitment that expects confirmations to be submitted
 * before a specified time on specified days of the week, similar to how an alarm
 * clock would be set.
 * 
 * Confirmations can be submitted if the next wakeup is close enough, (within a
 * specific window), and confirmations cannot be submitted if this window is 
 * missed.
 * 
 * The number of missed alarms can always be calulcated and used by enforcement
 * modules to penalize the commitment owner.
 */