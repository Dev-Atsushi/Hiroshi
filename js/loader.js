/* index - modal*/
const modal = document.getElementById('modal')

function openUserModal(name, avatar, role) {
  modal.style.display = 'block'
  modal.getElementsByClassName('avatar')[0].src = avatar
  modal.getElementsByClassName('name')[0].innerHTML = name
  modal.getElementsByClassName('role')[0].innerHTML = role
}

function closeModal() {
  modal.style.display = 'none'
}
