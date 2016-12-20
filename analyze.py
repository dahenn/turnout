import pandas as pd
import numpy as np
import re
import csv
import json

df = pd.read_csv('data/turnout.csv')
df['Presidential'] = 1
df['TurnoutHO'] = (df['TurnoutHO'].str.split('%').str.get(0).astype(float))/100
df.loc[(df.Year%4)!=0,'Presidential'] = 0
pres = df.loc[df.Presidential == 1]
nonpres = df.loc[df.Presidential == 0]
pres = pres.set_index(['Year', 'Abbreviation'])
pres = pres['TurnoutHO'].unstack()
nonpres = nonpres.set_index(['Year', 'Abbreviation'])
nonpres = nonpres['TurnoutHO'].unstack()

print pres
pres.to_csv('data/pres.csv')
nonpres.to_csv('data/nonpres.csv')
