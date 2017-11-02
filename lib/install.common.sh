COLOR_END='\e[0m'
COLOR_RED='\e[0;31m' # Red
COLOR_YEL='\e[0;33m' # Yellow
COLOR_PUR='\e[0;35m' # Yellow

# Assumed LOCAL_ROOT is set!
STEAMBOARD_ANSIBLE_ROOT=$(realpath "${LOCAL_ROOT}/ansible/")
OPT_PATH="${LOCAL_ROOT}/opt"
LIB_PATH="${LOCAL_ROOT}/lib"
PYTHON_REQUIREMENTS_FILE="${LIB_PATH}/python_requirements.txt"
VENV_NAME="python_venv"
VENV_PATH="${OPT_PATH}/${VENV_NAME}"
ENABLE_FILE="${LIB_PATH}/enable"
VENV_PYTHON_INTERPRETER="${VENV_PATH}/bin/python3"

msg_exit() {
    printf "$COLOR_RED$@$COLOR_END"
    printf "\n"
    printf "Exiting...\n"
    exit 1
}

msg_warning() {
    printf "$COLOR_YEL$@$COLOR_END"
    printf "\n"
}

msg_success() {
  printf "$COLOR_PUR$@$COLOR_END"
  printf "\n"
}

prompt_confirm() {
  while true; do
    read -r -n 1 -p "${1:-Continue?} [y/n]: " REPLY
    case $REPLY in
      [yY]) echo; return 0 ;;
      [nN]) echo; return 1 ;;
      *) printf " \033[31m %s \n\033[0m" "invalid input"
    esac
  done
}

install_deps() {
  apt-get install build-essential libc6-dev libncurses5-dev libncursesw5-dev libreadline6-dev libdb5.3-dev libgdbm-dev libsqlite3-dev libssl-dev libbz2-dev libexpat1-dev liblzma-dev zlib1g-dev
  cd /tmp
  mkdir steamboard-deps-install
  cd python-install
  wget https://www.python.org/ftp/python/3.5.2/Python-3.5.2.tgz
  tar -zxvf Python-3.5.2.tgz
  cd Python-3.5.2
  ./configure
  make -j4
  make install

  apt-get install python3-pip

  pip3 install --upgrade pip
  pip3 install virtualenv

  rm -rf /tmp/steamboard-deps-install
}

install_python_tools() {
  # Check if root
  [[ "$(whoami)" == "root" ]] && msg_exit "Please run as a normal user not root"

  # Check python
  [[ -z "$(which python3)" ]] && msg_exit "python3 is not installed or not in your path. For debian-based systems use: sudo apt-get install python3"
  [[ -z "$(which pip3)" ]] && msg_exit "pip is not installed or not in your path. For debian-based systems use: sudo apt-get install python3-pip"
  if [ $(pip3 show virtualenv | wc -l) == "0" ]; then msg_exit "virtualenv is not installed or not in your path. Using pip: sudo pip3 install virtualenv"; fi

  # Check python file
  [[ ! -f "${PYTHON_REQUIREMENTS_FILE}" ]] && msg_exit "python_requirements '${PYTHON_REQUIREMENTS_FILE}' does not exist or permssion issue.\nPlease check and rerun."

  mkdir -p "${OPT_PATH}"

  # Check if we have already installed this before
  if [ -d "${VENV_PATH}" ]; then
    msg_warning "Virtualenv ${VENV_PATH} already exists"
    prompt_confirm "Remove and reinstall?" \
      && msg_warning "Removing existing Virtualenv" \
      && rm -rf ${VENV_PATH} \
      && _install_venv
  else
    _install_venv
  fi
  _install_python_tools
}

_install_venv() {
  msg_warning "Installing Virtualenv"
  virtualenv "${VENV_PATH}"
  cat > ${ENABLE_FILE} << EndOfMessage
  source ${VENV_PATH}/bin/activate
  export ANSIBLE_ROOT=${STEAMBOARD_ANSIBLE_ROOT}
  export ANSIBLE_CONFIG=${STEAMBOARD_ANSIBLE_ROOT}/ansible.cfg
  export STEAMBOARD_PLAYBOOKS=${STEAMBOARD_ANSIBLE_ROOT}/playbooks
  export STEAMBOARD_HOSTS=${STEAMBOARD_ANSIBLE_ROOT}/hosts

EndOfMessage
}

_install_python_tools() {
  msg_warning "Installing Python tools"
  source ${ENABLE_FILE}
  pip install pip --upgrade
  pip install setuptools --upgrade
  pip install -r "$PYTHON_REQUIREMENTS_FILE"
  msg_success "Virtualenv + Ansible for python3 installed sucessfully."
  msg_success "Use: \$source ${ENABLE_FILE} to use the Virtualenv"
  deactivate
}
