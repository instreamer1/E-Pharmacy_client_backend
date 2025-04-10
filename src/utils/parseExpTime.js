// utils/parseExpTime.js

export const parseJwtExpTime = (value) => {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match) throw new Error(`Invalid JWT expiration format: ${value}`);

    const num = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return num;
      case 'm':
        return num * 60;
      case 'h':
        return num * 60 * 60;
      case 'd':
        return num * 60 * 60 * 24;
      default:
        throw new Error(`Unknown time unit in JWT expiration: ${unit}`);
    }
  };
