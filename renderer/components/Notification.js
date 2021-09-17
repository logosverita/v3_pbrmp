

export default  function Languages(key)  {
    const NOTIFICATION_TITLE = 'Title'
    const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
    const CLICK_MESSAGE = 'Notification c2222licked'

    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
        .onclick = () => console.log(CLICK_MESSAGE)

}