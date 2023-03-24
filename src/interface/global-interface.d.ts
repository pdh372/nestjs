type MappedTypeConst<Properties> = {
    readonly [P in Properties as Uppercase<string & P>]: P;
};
