#!/bin/bash
SCRIPT_NAME=`basename "$0"`
LOCAL_ROOT=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
DEV_INSTALL=0

print_usage() {
  echo "usage: ./${SCRIPT_NAME}"
  exit 0
}

TEMP=`getopt -o h,d --long help,dev -n setup -- "$@"`
[[ $? == 0 ]] || msg_exit "Options parsing failed. Terminating..."

set -e

eval set -- "${TEMP}"
while true; do
  case "$1" in
    -h | --help ) print_usage ; shift; break;;
    -d | --dev ) DEV_INSTALL=1 ; shift; break;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

source lib/install.common.sh

# last chance
msg_warning "All python tools will be installed under: $OPT_PATH/$VENV_NAME"
prompt_confirm "Continue installation?" || msg_exit "Terminating..."

install_python_tools

msg_success "Using Ansible for the remainder of the installation"
. $ENABLE_FILE
EXTRA_VARS="-e app_folder=${OPT_PATH}/steamboard -e ansible_python_interpreter=${VENV_PYTHON_INTERPRETER}"
# if [[ $DEV_INSTALL == "1" ]]; then
#   msg_warning "You are installing the development version of blockly"
#   prompt_confirm "Continue installation?" || msg_exit "Terminating..."
#   EXTRA_VARS=" -e install_type=dev ${EXTRA_VARS}"
# fi
# echo running ansible-playbook -i ${STEAMBOARD_HOSTS} ${STEAMBOARD_PLAYBOOKS}/install-steamboard.yml ${EXTRA_VARS}
msg_warning "Continuing installation using Ansible. Some operations will require root access"
ansible-playbook -i ${STEAMBOARD_HOSTS} ${STEAMBOARD_PLAYBOOKS}/install-steamboard.yml --ask-become-pass ${EXTRA_VARS}
deactivate

exit 0
