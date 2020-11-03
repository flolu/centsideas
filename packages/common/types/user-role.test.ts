import {InvalidUserRole, Role, UserRole} from './user-role'

describe('user role', () => {
  it('can be created from and converted to string', () => {
    const role = UserRole.fromString(Role.Basic)
    expect(role.toString()).toEqual(Role.Basic)
  })

  it('recognizes invalid roles', () => {
    const invalid = 'what the duck?'
    expect(() => UserRole.fromString(invalid)).toThrow(new InvalidUserRole(invalid))
  })

  it('can be created explicitly', () => {
    expect(UserRole.Basic().toString()).toEqual(Role.Basic)
    expect(UserRole.Premium().toString()).toEqual(Role.Premium)
    expect(UserRole.Team().toString()).toEqual(Role.Team)
    expect(UserRole.Admin().toString()).toEqual(Role.Admin)
  })

  it('determines the correct role', () => {
    const basic = UserRole.fromString(Role.Basic)
    const premium = UserRole.fromString(Role.Premium)
    const team = UserRole.fromString(Role.Team)
    const admin = UserRole.fromString(Role.Admin)

    expect(basic.isBasic).toEqual(true)
    expect(basic.isPremium).toEqual(false)
    expect(basic.isAdmin).toEqual(false)
    expect(basic.isAtLeastPremium).toEqual(false)

    expect(premium.isPremium).toEqual(true)
    expect(premium.isBasic).toEqual(false)
    expect(premium.isAtLeastPremium).toEqual(true)
    expect(premium.isAtLeastTeam).toEqual(false)
    expect(premium.isAdmin).toEqual(false)

    expect(team.isTeam).toEqual(true)
    expect(team.isBasic).toEqual(false)
    expect(team.isAtLeastPremium).toEqual(true)
    expect(team.isAtLeastTeam).toEqual(true)
    expect(team.isAdmin).toEqual(false)

    expect(admin.isAdmin).toEqual(true)
    expect(admin.isBasic).toEqual(false)
    expect(admin.isAtLeastPremium).toEqual(true)
    expect(admin.isAtLeastTeam).toEqual(true)
    expect(admin.isAdmin).toEqual(true)
  })

  it('checks through all roles and handles error if necessary', () => {
    enum Limits {
      Basic = 1,
      Premium = 2,
      Team = 3,
      Admin = 4,
    }

    class LimitError extends Error {
      constructor(role: UserRole, limit: Limits) {
        super(`Limit of ${role} role reached. It is: ${limit}`)
      }
    }

    const defaultCheck = (role: UserRole, count: number) => {
      role.switchCheck<Limits>(
        () => ({satisfied: count <= Limits.Basic, value: Limits.Basic}),
        () => ({satisfied: count <= Limits.Premium, value: Limits.Premium}),
        () => ({satisfied: count <= Limits.Team, value: Limits.Team}),
        () => ({satisfied: count <= Limits.Admin, value: Limits.Admin}),
        limit => {
          throw new LimitError(role, limit!)
        },
      )
    }

    const simpleValuedCheck = (role: UserRole, count: number) => {
      role.simpleValuedSwitchCheck<Limits>(
        Limits,
        limit => count <= limit,
        limit => {
          throw new LimitError(role, limit)
        },
      )
    }

    const testCheck = (checK: (role: UserRole, count: number) => void) => {
      const basic = UserRole.fromString(Role.Basic)
      expect(() => checK(basic, 1)).not.toThrow()
      expect(() => checK(basic, 2)).toThrow(new LimitError(basic, Limits.Basic))
      expect(() => checK(basic, 3)).toThrow(new LimitError(basic, Limits.Basic))
      expect(() => checK(basic, 4)).toThrow(new LimitError(basic, Limits.Basic))

      const premium = UserRole.fromString(Role.Premium)
      expect(() => checK(premium, 1)).not.toThrow()
      expect(() => checK(premium, 2)).not.toThrow()
      expect(() => checK(premium, 3)).toThrow(new LimitError(premium, Limits.Premium))
      expect(() => checK(premium, 4)).toThrow(new LimitError(premium, Limits.Premium))

      const team = UserRole.fromString(Role.Team)
      expect(() => checK(team, 1)).not.toThrow()
      expect(() => checK(team, 2)).not.toThrow()
      expect(() => checK(team, 3)).not.toThrow()
      expect(() => checK(team, 4)).toThrow(new LimitError(team, Limits.Team))

      const admin = UserRole.fromString(Role.Admin)
      expect(() => checK(admin, 1)).not.toThrow()
      expect(() => checK(admin, 2)).not.toThrow()
      expect(() => checK(admin, 3)).not.toThrow()
      expect(() => checK(admin, 4)).not.toThrow()
    }

    testCheck(defaultCheck)
    testCheck(simpleValuedCheck)
  })
})
