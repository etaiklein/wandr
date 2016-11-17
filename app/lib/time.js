
const travelTime = (distance) => {
  return Math.ceil(distance / 60);
}

const leaveTime = (time, distance) => {
  return new Date(time).getTime() - distance * 1000 - 60 * 5 * 1000
}

export const toTimeString = (time) => {
  return new Date(time).toLocaleTimeString().replace(/(.*)\D\d+/, '$1')
}

export const travelTimePlusFive = (time, distance) => {
  return new Date(time).getTime() - distance * 1000 - 60 * 5 * 1000; //TODO: explain this
}

export const travelTimeString = (time, distance) => {
  return `${travelTime(distance)} min`
}

export const leaveTimeString = (time, distance) => {
  if (!time) {return ''}
  let leaveAt = leaveTime(time, distance);
  return `${toTimeString(leaveAt)}`
}

export const arriveBefore = (time, distance) => {
  if (!time) {return ''}
  return `${toTimeString(time)}`
}

export const isLate = (time, distance) => {
  return leaveTime(time) < new Date();
}
