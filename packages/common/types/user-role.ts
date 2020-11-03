import bodyParser = require('body-parser')
import {RpcStatus, UserErrors} from '../enums'
import {Exception} from './exception'

export enum Role {
  Basic = 'basic',
  Premium = 'premium',
  Team = 'team',
  Admin = 'admin',
}

interface SwitchCheckValued<T> {
  satisfied: boolean
  value: T
}

export class UserRole {
  static readonly roles = [Role.Basic, Role.Premium, Role.Team, Role.Admin]

  private constructor(private readonly role: Role) {}

  static fromString(role: string) {
    if (!UserRole.roles.includes(role as any)) throw new InvalidUserRole(role)
    return new UserRole(role as Role)
  }

  static Basic() {
    return new UserRole(Role.Basic)
  }

  static Premium() {
    return new UserRole(Role.Premium)
  }

  static Team() {
    return new UserRole(Role.Team)
  }

  static Admin() {
    return new UserRole(Role.Admin)
  }

  switchCheck<T = any>(
    checkBasic: () => boolean | SwitchCheckValued<T>,
    checkPremium: () => boolean | SwitchCheckValued<T>,
    checkTeam: () => boolean | SwitchCheckValued<T>,
    checkAdmin: () => boolean | SwitchCheckValued<T>,
    errorHandler: (value?: T) => void,
  ) {
    let satisfied: boolean | SwitchCheckValued<T> | undefined
    if (this.isBasic) satisfied = checkBasic()
    if (this.isPremium) satisfied = checkPremium()
    if (this.isTeam) satisfied = checkTeam()
    if (this.isAdmin) satisfied = checkAdmin()
    if (satisfied instanceof Boolean && !satisfied) return errorHandler()
    if (!(satisfied instanceof Boolean) && !(satisfied as SwitchCheckValued<T>).satisfied)
      return errorHandler((satisfied as SwitchCheckValued<T>).value)
  }

  simpleValuedSwitchCheck<T>(
    comparators: Record<keyof typeof Role, T>,
    condition: (role: T) => boolean,
    errorHandler: (value: T) => void,
  ) {
    const valueMap: any = {}
    for (const roleKey of Object.keys(Role)) {
      valueMap[Object(Role)[roleKey]] = comparators[roleKey as keyof typeof Role]
    }
    const getValue = (role: Role) => valueMap[role]
    return this.switchCheck(
      () => ({satisfied: condition(getValue(Role.Basic)), value: getValue(Role.Basic)}),
      () => ({satisfied: condition(getValue(Role.Premium)), value: getValue(Role.Premium)}),
      () => ({satisfied: condition(getValue(Role.Team)), value: getValue(Role.Team)}),
      () => ({satisfied: condition(getValue(Role.Admin)), value: getValue(Role.Admin)}),
      (value?: T) => errorHandler(value!),
    )
  }

  get isBasic() {
    return this.role === Role.Basic
  }

  get isPremium() {
    return this.role === Role.Premium
  }

  get isTeam() {
    return this.role === Role.Team
  }

  get isAdmin() {
    return this.role === Role.Admin
  }

  get isAtLeastPremium() {
    return this.isAdmin || this.isTeam || this.isPremium
  }

  get isAtLeastTeam() {
    return this.isAdmin || this.isTeam
  }

  toString() {
    return this.role
  }
}

export class InvalidUserRole extends Exception {
  name = UserErrors.InvalidRole
  code = RpcStatus.INVALID_ARGUMENT

  constructor(role: string) {
    super(`Role ${role} is invalid.`, {role})
  }
}
